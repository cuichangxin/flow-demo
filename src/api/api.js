import api from '../config/http'

export default {
  // 登录接口
  userLogin:api('/user/usrLogin','post',false),
  // 获取用户任务列表
  getUserTask:api('/user/getUserTask','post',true),
  // 保存任务详情
  saveTaskDetail:api('/task/saveDaTreeParams','post',true),
  // 获取任务详情
  getTaskDetail:api('/task/getDaTreeParams','post',true),
  // 提交任务接口
  submitTask:api('/user/submitUserTask','post',true),
  // 测试用例左侧树
  getTestTree:api('/task/getTestcaseTree','post',true),
  // 新建项目
  createProject:api('/task/saveProject','post',true),
  // 新建项目流程图数据以及工具列表
  projectSubTool:api('/task/getActiveModelAndTool','post',true),
  // 获取项目管理列表
  getProjectList:api('/task/getProjectList','post',true),
  // 删除项目列表项目
  removeProject:api('/task/deleteProject','post',true),
  // 项目看板切换
  projectChange:api('/user/changeBoardProject','post',true),
  // 看板展示
  boardShow:api('/user/getBoardLine','post',false)
}