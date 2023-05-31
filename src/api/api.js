import api from '../config/http'
export default {
  // 登录接口
  userLogin:api('/dev-api/user/usrLogin','post'),
  // 获取用户任务列表
  getUserTask:api('/dev-api/user/getUserTask','post'),
  // 保存任务详情
  saveTaskDetail:api('/dev-api/task/saveDaTreeParams','post'),
  // 获取任务详情
  getTaskDetail:api('/dev-api/task/getDaTreeParams','post'),
  // 提交任务接口
  submitTask:api('/dev-api/user/submitUserTask','post'),
  // 看板连接线
  getBroadLine:api('/dev-api/user/getBoardLine','post'),
  // 测试用例左侧树
  getTestTree:api('/dev-api/task/getTestcaseTree','post'),
  // 新建项目
  createProject:api('/dev-api/task/saveProject','post'),
  // 新建项目流程图数据以及工具列表
  projectSubTool:api('/dev-api/task/getActiveModelAndTool','post'),
  // 获取项目管理列表
  getProjectList:api('/dev-api/task/getProjectList','post')
}