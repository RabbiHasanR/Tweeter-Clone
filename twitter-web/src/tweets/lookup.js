import {BackendLookup} from '../lookup'


export function apiTweetCreate(newTweet, callback) {
    BackendLookup('POST', '/tweets/create/', callback, { content: newTweet })
}
export function apiTweetList(callback) {

    BackendLookup('GET', '/tweets/', callback)
}