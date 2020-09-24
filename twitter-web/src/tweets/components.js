import React,{useState,useEffect}from 'react'

import { apiTweetCreate, apiTweetAction, apiTweetList} from './lookup'



export function TweetsComponents(props){
    const textAreaRef=React.createRef()
    const [newTweets,setNewTweets]=useState([])
    const handleBackednUpdate = (response, status) => {
        //backend api response handler
        let tempNewTweets = [...newTweets]
        if (status === 201) {
            tempNewTweets.unshift(response)
            setNewTweets(tempNewTweets)
        } else {
            console.log(response)
            alert('An error occured please try again!')
        }
    }
    const handleSubmit=(event)=>{
        event.preventDefault()
        const newVal = textAreaRef.current.value
        //backend api request
        apiTweetCreate(newVal,handleBackednUpdate)
        textAreaRef.current.value=''
    }
    return (
        <div className={props.className}>
            <div className='col-12 mb-3'>
                <form onSubmit={handleSubmit}>
                    <textarea ref={textAreaRef} className='form-control' name='tweet'>

                    </textarea>
                    <button type='submit' className='btn btn-primary my-3'>Tweet</button>
                </form>
            </div>
            <TweetLists newTweets={newTweets}/>
        </div>
        
    )
}

export function TweetLists(props) {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets,setTweets]=useState([])
    const [tweetsDidSet,setTweetsDidSet]=useState(false)
    const handleTweetListLookup = (response, status) => {
        console.log(response, status)
        if (status === 200) {
            setTweetsDidSet(true)
            setTweetsInit(response)
        } else {
            alert('There was an error!')
        }
    }
    useEffect(()=>{
        const final = [...props.newTweets].concat(tweetsInit)
        if(final.length!==tweets.length){
            setTweets(final)
        }
    },[props.newTweets,tweets,tweetsInit])

    useEffect(() => {
        if(tweetsDidSet===false){
            apiTweetList(handleTweetListLookup)
        }
    }, [tweetsInit,tweetsDidSet,setTweetsDidSet])

    return tweets.map((item, index) => {
        return <Tweet tweet={item} key={`${index}-{item.id}`} className='my-5 py-5 border bg-white text-dark' />
    })
}

export function ParentTweet(props){
    const {tweet}=props
    return(
        tweet.parent?
        <div className='row'>
            <div className='col-11 mx-auto p-3 border rounded'>
                <p className='mb-0 text-muted small'>ReTweet</p>
                <Tweet className={' '} tweet={tweet.parent}/>
            </div>
        </div>
        :null
    )
}
export function Tweet(props) {
    const { tweet } = props
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
    return (
        <div className={className}>
            <div>
                <p>{tweet.id}-{tweet.content}</p>
                <ParentTweet tweet={tweet}/>
            </div>
            <div className='btn btn-group'>
                <ActionBtn tweet={tweet} action={{ type: 'like',display:'Likes' }} />
                <ActionBtn tweet={tweet} action={{ type: 'unlike',display:'UnLike' }} />
                <ActionBtn tweet={tweet} action={{ type: 'retweet',display:'Retweet'}} />
            </div>
        </div>
    )
}
export function ActionBtn(props) {
    const { tweet, action } = props
    const className = props.className ? props.className : "btn btn-primary btn-sm"
    const actionDisplay=action.display?action.display :'Action'
    const [likes,setLikes] =useState(tweet.likes ? tweet.likes :0)
    //const [userLike, setUserLike]=useState(tweet.userLike===true?true:false)
    const handleActionBackendEvent=(response,status)=>{
        console.log(response, status)
        if(status===200){
            setLikes(response.likes)
            //setUserLike(false)
        }
    }
    const handleClick=(event)=>{
        event.preventDefault()
        apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return (
            <button className={className} onClick={handleClick}>{display}</button> 
    )
}