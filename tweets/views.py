from django.shortcuts import render
from django.http import HttpResponse,Http404,JsonResponse

from .models import Tweet

# Create your views here.

def home_view(request,*args,**kwargs):
    #return HttpResponse(f'<h1>Hello World {kwargs}<h1>')
    return render(request,'pages/home.html',context={},status=200)


def tweet_list_view(request,*args,**kwargs):
    qs=Tweet.objects.all()
    tweet_list=[{'id':x.id,'content':x.content} for x is qs]
    data={
        'response':tweet_list
    }

    return JsonResponse(data)

def tweet_details_view(request,tweet_id,*args,**kwargs):

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
