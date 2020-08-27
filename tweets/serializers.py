from rest_framework import serializers
from django.conf import settings
from .models import Tweet

class TweetActionSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    action=serializers.CharField()

class TweetSerializers(serializers.ModelSerializer):
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