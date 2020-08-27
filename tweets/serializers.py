from rest_framework import serializers
from django.conf import settings
from .models import Tweet

class TweetActionSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    action=serializers.CharField()

class TweetSerializers(serializers.ModelSerializer):
    class Meta:
        model=Tweet
        fields=['content']
    
    def validate_content(self,value):
        if len(value)>settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError('This tweet is to long!')
        return value