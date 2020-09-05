from django.db import models
from django.conf import settings
import random

from rest_framework import serializers

# Create your models here.
User=settings.AUTH_USER_MODEL
TWEET_ACTION_OPTIONS=settings.TWEET_ACTION_OPTIONS

class TweetLike(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    tweet=models.ForeignKey('Tweet',on_delete=models.CASCADE)
    timestamp=models.DateTimeField(auto_now_add=True)

    def validate_action(self,value):
        value=value.lower().strip() #'Like '->'like'
        if not value in TWEET_ACTION_OPTIONS:
            raise serializers.ValidationError('This is not a valid action for tweet!')
        return value

class Tweet(models.Model):
    parent=models.ForeignKey('self',null=True,on_delete=models.SET_NULL)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    likes=models.ManyToManyField(User,related_name='tweet_user',blank=True,through=TweetLike)
    content=models.TextField(blank=True,null=True)
    image=models.FileField(upload_to='images/',blank=True,null=True)
    timestamp=models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return self.content

    class Meta:
        ordering=['-id']

    @property
    def is_retweet(self):
        return self.parent!=None

    def serialize(self):
        '''
        feel free to delete
        '''
        return{
            'id':self.id,
            'content':self.content,
            'likes':random.randint(0,200)
        }