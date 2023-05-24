import api from '../config/http'
export default {
  getLogin:api('/dev-api/user/usrLogin','post'),
  getUserTask:api('/dev-api/user/getUserTask','post'),
  saveTaskDetail:api('/dev-api/task/saveDaTreeParams','post'),
  getTaskDetail:api('/dev-api/task/getDaTreeParams','post'),
  submitTask:api('/dev-api/user/submitUserTask','post')
}