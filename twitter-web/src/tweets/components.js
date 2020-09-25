import React,{useState}from 'react'
import { TweetLists } from './list'
import { TweetCreate} from './create'

export function TweetsComponents(props){
    const {username,canTweet}=props
    const [newTweets,setNewTweets]=useState([])
    const parseCanTweet=canTweet==='false'?false:true
    console.log(parseCanTweet)
    const handleNewTweet = (newTweet) => {
        //backend api response handler
        let tempNewTweets = [...newTweets]
        tempNewTweets.unshift(newTweet)
        setNewTweets(tempNewTweets)
    }
    return (
        <div className={props.className}>
            {parseCanTweet === true && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3'/>}
            <TweetLists newTweets={newTweets} username={username}/>
        </div>
        
    )
}