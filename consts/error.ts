export enum ErrorCode {
  Unauthorized = 401,
  GetAccessTokenFailed = 402,
  NonYearPartMember = 403,
  NotEnoughRoom = 404,
}

export const ErrorMessages = {
  [ErrorCode.Unauthorized]: '请前去登录。',
  [ErrorCode.GetAccessTokenFailed]: '获取用户信息失败，请联系管理员。',
  [ErrorCode.NonYearPartMember]: '您尚未登记，请联系活动工作人员登记。',
  [ErrorCode.NotEnoughRoom]: '没有足够的房间安排了，请联系人事。'
}
