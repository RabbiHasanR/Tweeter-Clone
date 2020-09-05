from rest_framework import serializers
from django.conf import settings
from .models import Tweet

class TweetActionSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    action=serializers.CharField()
    content=serializers.CharField(allow_blank=True,required=False)

class TweetCreateSerializers(serializers.ModelSerializer):
    likes=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Tweet
        fields=['id','content','likes']

    def get_likes(self,obj):
        return obj.likes.count()
    
    def validate_content(self,value):
        if len(value)>settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError('This tweet is to long!')
        return value

class TweetSerializers(serializers.ModelSerializer):
    likes=serializers.SerializerMethodField(read_only=True)
    # content=serializers.SerializerMethodField(read_only=True)
    parent=TweetCreateSerializers(read_only=True)
    class Meta:
        model=Tweet
        fields=['id','content','likes','is_retweet','parent']

    def get_likes(self,obj):
        return obj.likes.count()
    
    # def get_content(self,obj):
    #     content=obj.content
    #     if obj.is_retweet:
    #         content=obj.parent.content
    #     return content
    