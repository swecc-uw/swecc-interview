import { TextCard } from '../shared'
import { getNextMonday } from '../utils/time'

function Welcome () {
  return (
    <TextCard width={'40%'}>
      <p>
        Click the button below to start the sign up process. Keep in mind that
        you will be signing up for the week of next Monday ({getNextMonday(new Date()).toDateString()}).
      </p>
    </TextCard>
  )
}

export default Welcome
