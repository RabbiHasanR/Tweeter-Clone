import React, { useState, useEffect } from 'react'

import {apiTweetList } from './lookup'
import { Tweet} from './detail'

export function TweetLists(props) {
    const { username } = props
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])
    const [tweetsDidSet, setTweetsDidSet] = useState(false)
    const handleTweetListLookup = (response, status) => {
        console.log(response, status)
        if (status === 200) {
            setTweetsDidSet(true)
            setTweetsInit(response)
        } else {
            alert('There was an error!')
        }
    }
    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit)
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [props.newTweets, tweets, tweetsInit])

    useEffect(() => {
        if (tweetsDidSet === false) {
            apiTweetList(username, handleTweetListLookup)
        }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet, username])

    const handleDidRetweet = (newTweet) => {
        const updateTweetsInit = [...tweetsInit]
        updateTweetsInit.unshift(newTweet)
        setTweetsInit(updateTweetsInit)

        const updateFinalTweets = [...tweets]
        updateFinalTweets.unshift(tweets)
        setTweets(updateFinalTweets)
    }

    return tweets.map((item, index) => {
        return <Tweet
            tweet={item}
            didRetweet={handleDidRetweet}
            key={`${index}-{item.id}`}
            className='my-5 py-5 border bg-white text-dark' />
    })
}