
export default function useDark(){
  const match = matchMedia('(prefers-color-scheme:dark)').matches
  return {
    match
  }
}