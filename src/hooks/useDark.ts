export default function useDark(){
  const match = matchMedia('(prefers-color-scheme:dark)').matches
  const localMatch = localStorage.getItem('dark-theme')
  return {
    match,
    localMatch
  }
}