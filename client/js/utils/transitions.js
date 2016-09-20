export const durations = {
  searchBox: '0.2s',
}

export const timings = {
  fastOutSlowIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
}

export default function transitions(
  props, 
  duration='0.2s', 
  timingFunction=timings.fastOutSlowIn, 
  delay='0s'
) {
  if (props.map) {
    return props.map(
      property => `${property} ${duration} ${timingFunction} ${delay}`
    ).join();
  } else {
    return`${props} ${duration} ${timingFunction} ${delay}`
  }
}
