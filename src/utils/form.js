import moment from 'moment';
export default {
  _factoryChangeHandler(v) {
    return new Promise((resolve, reject) => {
      if (this.cjbmDisabled) this.cjbmDisabled = false;
      resolve(this.$store.dispatch('dict/getWorkShop', { key: v.key, lxjp: 'CJBM' }));
    });
  },
  /**
   * 获取查询列表参数
   * @param { Form } form 表单对象
   * @param { Object } customParam 自定义参数
   */
  _getFormParams(form, customParam) {
    let params;
    if (form && form._isVue) {
      let values = this._getFieldsValue(form);
      params = { ...values, ...this.PAGINATION, ...customParam };
    } else {
      customParam = form;
      params = { ...this.PAGINATION, ...customParam };
    }
    delete params.total;
    return params;
  },
  /**
   * 获取查询列表参数
   * @param { Form } form 表单对象
   * @param { Object } customParam 自定义参数
   */
  _getFieldsValue(form) {
    let values = form.getFieldsValue();
    let results = JSON.parse(JSON.stringify(values));
    for (let key in values) {
      let val = values[key];
      if (val) {
        if (val._isAMomentObject) {
          let node = document.getElementById(key);
          let fields = node.getAttribute('data-key') || key;
          let formatStr = node.getAttribute('data-format') || 'YYYY-MM-DD'; // 格式类型
          results[fields] = val.format(formatStr);
        }
        if (val.constructor === Array && val.length > 0 && val[0]._isAMomentObject) {
          let node = document.getElementById(key);
          let fields = node.getAttribute('data-key') || `startTime,endTime`;
          if (fields && fields.indexOf(',') > 0) {
            let formatStr = node.getAttribute('data-format') || 'YYYY-MM-DD'; // 格式类型
            fields = fields.split(',');
            console.log(fields);

            results[fields[0]] = val[0].format(formatStr);
            results[fields[1]] = val[1].format(formatStr);
            delete results[key];
            continue;
          }
        }
        if (val.constructor === Object) {
          // 针对搜索下拉框
          results[key] = val.key;
        }
        // 处理多选数组类型，逗号分隔
        if (val.constructor === Array) {
          results[key] = val.join(',');
        }
      }
      // 未赋值的取值
      if (val === undefined) {
        delete results[key];
      }
    }
    return results;
  },
  /**
   * 表单赋值
   * @param { Form } form 表单对象
   * @param { Object } values 表单值
   * @param { Object } formatRule 格式规则
   */
  _setFieldsValue(form, values, formatRule) {
    let fields = form.getFieldsValue();
    for (let key in fields) {
      let value = values[key];
      if (value !== undefined) {
        if (formatRule) {
          if (formatRule[key] === 'Moment') {
            if (value.constructor === Array && value.length > 0) {
              fields[key] = [
                value[0] ? moment(value[0]) : undefined,
                value[1] ? moment(value[1]) : undefined,
              ];
            } else {
              fields[key] = value ? moment(value) : undefined;
            }
          } else {
            fields[key] = value;
          }
        } else {
          fields[key] = value;
        }
      }
    }

    form.setFieldsValue(fields);
  },
  _confirm(obj) {
    this.$confirm({
      title: obj.title,
      content: h => <div style="color:red;">{obj.content}</div>,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        obj.onOk && obj.onOk();
      },
      onCancel() {},
      class: 'test',
    });
  },
};
