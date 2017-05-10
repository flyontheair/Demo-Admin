/**
 * 接口配置模块集合(不将配置放在一块，尽量避免合作开发冲突)
 */
import {merge} from "lodash";
import oneConfig from './one/one.conf'
import twoConfig from './two/two.conf'

/**
 *合并所有配置
 */
export default merge({},oneConfig,twoConfig);
