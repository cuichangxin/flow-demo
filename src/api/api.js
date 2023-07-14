import api from '../config/http'

export default {
  // 登录接口
  userLogin:api('/user/usrLogin','post'),
  // 获取用户任务列表
  getUserTask:api('/user/getUserTask','post'),
  // 保存任务详情
  saveTaskDetail:api('/task/saveDaTreeParams','post'),
  // 获取任务详情
  getTaskDetail:api('/task/getDaTreeParams','post'),
  // 提交任务接口
  submitTask:api('/user/submitUserTask','post'),
  // 测试用例左侧树
  getTestTree:api('/task/getTestcaseTree','post'),
  // 新建项目
  createProject:api('/task/saveProject','post'),
  // 新建项目流程图数据以及工具列表
  projectSubTool:api('/task/getActiveModelAndTool','post'),
  // 获取项目管理列表
  getProjectList:api('/task/getProjectList','post'),
  // 删除项目列表项目
  removeProject:api('/task/deleteProject','post'),
  // 项目看板切换
  projectChange:api('/user/changeBoardProject','post'),
  // 看板展示
  boardShow:api('/user/getBoardLine','post'),
  // 任务提示状态改变
  changeTaskStatus:api('/user/finishRead','post')
}