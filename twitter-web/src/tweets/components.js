import React,{useState,useEffect}from 'react'

import {CreateTweet,LoadTweets} from '../lookup'



export function TweetsComponents(props){
    const textAreaRef=React.createRef()
    const [newTweets,setNewTweets]=useState([])
    const handleSubmit=(event)=>{
        event.preventDefault()
        const newVal = textAreaRef.current.value
        let tempNewTweets=[...newTweets]
        console.log('new value:',newVal)
        CreateTweet(newVal,(response,status)=>{
            console.log(response,status)
            if(status===201){
                tempNewTweets.unshift(response)
            }else{
                console.log(response)
                alert('An error occured please try again!')
            }
            
        })
        setNewTweets(tempNewTweets)
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
    const myCallBack = (response, status) => {
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
            LoadTweets(myCallBack)
        }
    }, [tweetsInit,tweetsDidSet,setTweetsDidSet])

    return tweets.map((item, index) => {
        return <Tweet tweet={item} key={`${index}-{item.id}`} className='my-5 py-5 border bg-white text-dark' />
    })
}


export function Tweet(props) {
    const { tweet } = props
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
    return (
        <div className={className}>
            <p>{tweet.id}-{tweet.content}</p>
            <div className='btn btn-group'>
                <ActionBtn tweet={tweet} action={{ type: 'likes',display:'Likes' }} />
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
    const [userLike, setUserLike]=useState(tweet.userLike===true?true:false)
    const handleClick=(event)=>{
        event.preventDefault()
        if(action.type==='likes'){
            if (userLike===true){
                setLikes(likes - 1)
                setUserLike(false)
            }else{
                setLikes(tweet.likes + 1)
                setUserLike(true)
            }
            
        }
    }
    const display = action.type === 'likes' ? `${likes} ${actionDisplay}` : actionDisplay
    return (
            <button className={className} onClick={handleClick}>{display}</button> 
    )
}