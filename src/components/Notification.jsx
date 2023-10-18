import { useDispatch, useSelector } from 'react-redux'

const Notification = () => {

  console.log('notification occurred')

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  const dispatch = useDispatch()
  const notification = useSelector(({ notification }) => {
  //console.log('notification', notification)
    return notification
  })

  if(notification === '') {
    return null
  }

  if(notification.includes('error') || notification.includes('login failed'))  {
    return (
      <div className="error">
        {notification}
      </div>
    )
  }

  return (
    <div className="ok">
      {notification}
    </div>
  )
}

export default Notification