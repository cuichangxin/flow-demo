import { ref } from 'vue'

export default function useDialog(){
  const visible = ref(false)
  const openDialog = ()=>{visible.value = true}
  const closeDialog = ()=>{visible.value = false}
  return {
    visible,
    openDialog,
    closeDialog
  }
}