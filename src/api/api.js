import api from '../config/http'
export default {
  userLogin:api('/dev-api/user/usrLogin','post'),
  getUserTask:api('/dev-api/user/getUserTask','post'),
  saveTaskDetail:api('/dev-api/task/saveDaTreeParams','post'),
  getTaskDetail:api('/dev-api/task/getDaTreeParams','post'),
  submitTask:api('/dev-api/user/submitUserTask','post'),
  getBroadLine:api('/dev-api/user/getBoardLine','post'),
  getTestTree:api('/dev-api/task/getTestcaseTree','post')
}