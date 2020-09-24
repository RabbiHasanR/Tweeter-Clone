import {BackendLookup} from '../lookup'


export function apiTweetCreate(newTweet, callback) {
    BackendLookup('POST', '/tweets/create/', callback, { content: newTweet })
}

export function apiTweetAction(tweetId,action,callback) {
    const data = { id: tweetId, action: action }
    BackendLookup('POST', '/tweets/action/', callback, data )
}

export function apiTweetList(callback) {

    BackendLookup('GET', '/tweets/', callback)
}