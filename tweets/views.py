import random
from  django.conf import settings
from django.shortcuts import render,redirect
from django.http import HttpResponse,Http404,JsonResponse
from django.utils.http import is_safe_url

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import TweetSerializers,TweetActionSerializer,TweetCreateSerializers


from .models import Tweet
from .forms import TweetForm

# Create your views here.

ALLOWED_HOSTS=settings.ALLOWED_HOSTS

def home_view(request,*args,**kwargs):
    print(request.user or None)
    #return HttpResponse(f'<h1>Hello World {kwargs}<h1>')
    return render(request,'pages/home.html',context={},status=200)


@api_view(['POST']) #http method the client =POST
#@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated]) 
def tweet_create_view(request,*args,**kwargs):
    serializer=TweetCreateSerializers(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data,status=201)
    return Response({},status=400)
@api_view(['GET'])
def tweet_list_view(request,*args,**kwargs):
    qs=Tweet.objects.all()
    serialize=TweetSerializers(qs,many=True)
    return Response(serialize.data,status=200)

@api_view(['GET'])
def tweet_details_view(request,tweet_id,*args,**kwargs):
    qs=Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({},status=404)
    obj=qs.first()
    serialize=TweetSerializers(obj)
    return Response(serialize.data,status=200)

@api_view(['DELETE','POST'])
@permission_classes([IsAuthenticated]) 
def tweet_delete_view(request,tweet_id,*args,**kwargs):
    qs=Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({},status=404)
    qs=qs.filter(user=request.user)
    if not qs.exists():
        return Response({'message':'You can not delete this!'},status=401)
    obj=qs.first()
    obj.delete()
    return Response({'message':'Tweet removed!'},status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def tweet_action_view(request,*args,**kwargs):
    '''
    id is required
    Action options are: Like,Unlke,retweet
    '''
    #print(request.POST,request.data)
    serializer=TweetActionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data=serializer.validated_data
        tweet_id=data.get('id')
        action=data.get('action')
        content=data.get('content')
        qs=Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({},status=404)
        obj=qs.first()
        if action=='like':
            obj.likes.add(request.user)
            serialize=TweetSerializers(obj)
            return Response(serialize.data,status=200)
        elif action=='unlike':
            obj.likes.remove(request.user)
            serialize=TweetSerializers(obj)
            return Response(serialize.data,status=200)
        elif action=='retweet':
            parent_obj=obj
            new_tweet=Tweet.objects.create(user=request.user,parent=parent_obj,content=content)
            serialize=TweetSerializers(new_tweet)
            return Response(serialize.data,status=201)
    return Response({},status=200)

def tweet_create_view_pure_django(request,*args,**kwargs):
    user=request.user
    if not request.user.is_authenticated:
        user=None
        if request.is_ajax():
            return JsonResponse({},status=401)
        return redirect(settings.LOGIN_URL)
    form=TweetForm(request.POST or None)
    next_url=request.POST.get('next') or None
    if form.is_valid():
        # print('form is valid')
        obj=form.save(commit=False)
        # print('content:',obj.content)
        obj.user=user
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

def tweet_list_view_pure_django(request,*args,**kwargs):
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

def tweet_details_view_pure_django(request,tweet_id,*args,**kwargs):
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
