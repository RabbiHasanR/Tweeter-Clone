import random
from django.shortcuts import render
from django.http import HttpResponse,Http404,JsonResponse

from .models import Tweet

# Create your views here.

def home_view(request,*args,**kwargs):
    #return HttpResponse(f'<h1>Hello World {kwargs}<h1>')
    return render(request,'pages/home.html',context={},status=200)


def tweet_list_view(request,*args,**kwargs):
    '''
    Rest api view 
    consume by javascript or Swift/java/android
    return json data
    '''
    qs=Tweet.objects.all()
    tweet_list=[{'id':x.id,'content':x.content,'likes':random.randint(0,1237)} for x in qs]
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
