import random
from  django.conf import settings
from django.shortcuts import render,redirect
from django.http import HttpResponse,Http404,JsonResponse
from django.utils.http import is_safe_url

from .models import Tweet
from .forms import TweetForm

# Create your views here.

ALLOWED_HOSTS=settings.ALLOWED_HOSTS

def home_view(request,*args,**kwargs):
    #return HttpResponse(f'<h1>Hello World {kwargs}<h1>')
    return render(request,'pages/home.html',context={},status=200)


def tweet_create_view(request,*args,**kwargs):
    form=TweetForm(request.POST or None)
    next_url=request.POST.get('next') or None
    if form.is_valid():
        print('form is valid')
        obj=form.save(commit=False)
        print('content:',obj.content)
        obj.save()
        if request.is_ajax():
            return JsonResponse(obj.serialize(),status=201) #201 for created items
        if next_url !=None and is_safe_url(next_url,ALLOWED_HOSTS):
            return redirect(next_url)
        form=TweetForm()
    if form.errors:
        if request.is_ajax():
            return JsonResponse(form.errors,status=400)
    return render(request,'components/form.html',context={'form':form})

def tweet_list_view(request,*args,**kwargs):
    '''
    Rest api view 
    consume by javascript or Swift/java/android
    return json data
    '''
    qs=Tweet.objects.all()
    tweet_list=[x.serialize() for x in qs]
    data={
        'isUser':False,
        'response':tweet_list
    }

    return JsonResponse(data)

def tweet_details_view(request,tweet_id,*args,**kwargs):
    '''
    Rest api view 
    consume by javascript or Swift/java/android
    return json data
    '''

    data={
        'id':tweet_id
    }
    status=200
    try:
        obj=Tweet.objects.get(id=tweet_id)
        data['content']=obj.content
    except :
        data['message']='Not found!'
        status=404
    return JsonResponse(data,status=status)
