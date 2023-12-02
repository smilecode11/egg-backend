import { Controller } from 'egg';
import { GlobalErrorTypes } from '../extend/helper';
import { defineRules } from '../roles/roles';
import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { difference } from 'lodash';
import { assign } from 'lodash/fp'; //  从 loadash/fp 下获取的方法, 是不会修改源数据的

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

const fieldsOptions = { fieldsFrom: rule => rule.fields || [] };

interface IOptions {
  action?: string; //  casl 自定义 action
  key?: string;
  value?: { type: 'params' | 'body', valueKey: string };
}

const defaultSearchOptions: IOptions = {
  key: 'id',
  value: { type: 'params', valueKey: 'id' },
};

//  用于 casl 和 mongoose 的 modelName, 如 Channel 是 casl 定义的 modelName, 查询目标的 mongoose modeName 是 Work
interface ModelMapping {
  mongoose: string;
  casl: string;
}

export default function checkPermission(modelName: string | ModelMapping, errorType: GlobalErrorTypes, options?: IOptions) {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const orgiginMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const _self = this as Controller;
      //  eslint-disable-next-line
      //  @ts-ignore
      const { ctx } = _self;
      const { method } = ctx.request;
      const searchOptions = assign(defaultSearchOptions, options || {});
      const { key, value } = searchOptions as Required<IOptions>;
      const { type, valueKey } = value;
      //  构建一个 query, 用于
      const source = (type === 'params') ? ctx.params : ctx.request.body;
      const query = {
        [key as string]: source[valueKey],
      };
      //  构建 modelName
      const mongooseModelName = typeof modelName === 'string' ? modelName : modelName.mongoose;
      const caslModelName = typeof modelName === 'string' ? modelName : modelName.casl;
      let permission = false;
      let keysPermission = true;
      // const action = caslMethodMapping[method];
      //  如果自定义的 action, 则直接使用自定义的 action, 不再使用 caslMethodMapping 中的 action
      const action = options && options.action ? options.action : caslMethodMapping[method];
      // console.log('_action', action);
      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType });
      }
      const ability = defineRules(ctx.state.user);
      // 我们需要先获取 rules 看他是否存在对应条件
      const rule = ability.relevantRuleFor(action, caslModelName);
      //  如果存在条件, 执行条件逻辑
      if (rule && rule.conditions) {
        const selectRecord = await ctx.model[mongooseModelName].findOne(query).lean();
        permission = ability.can(action, subject(caslModelName, selectRecord));
      } else {
        permission = ability.can(action, caslModelName);
      }
      //  如果有字段限制, 我们需要对字段包含关系的进行判断处理
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, caslModelName, fieldsOptions);
        if (fields.length > 0) {
          //  1. 过滤 request.body , 将可操作的值进行更新
          //  2. 通过对比 payload 的 key 和可被允许的 fields 作比较, 返回错误信息
          const payloadKeys = Object.keys(ctx.request.body);
          const diffKeys = difference(payloadKeys, fields);
          // console.log('_diffKeys', diffKeys);
          keysPermission = diffKeys.length === 0;
        }
      }
      // console.log('_permission', permission, '_keyPermissition', keysPermission);
      if (!permission || !keysPermission) return ctx.helper.fail({ ctx, errorType });
      await orgiginMethod.apply(this, args);
    };
  };
}
