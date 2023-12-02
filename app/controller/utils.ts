import { Controller } from 'egg';
// import { createWriteStream } from 'fs';
import { nanoid } from 'nanoid';
import { extname, join/* , parse */ } from 'path';
// import * as sharp from 'sharp';
// import { pipeline } from 'stream/promises';
import * as streamWormhole from 'stream-wormhole';
import { FileStream } from '../../typings/app';

export const utilsErrorMessages = {
  uploadFail: {
    errno: 103001,
    message: '请选择上传文件',
  },
  imageUploadFail: {
    errno: 103002,
    message: '图片上传失败',
  },
  imageUploadWithTypeFail: {
    errno: 103003,
    message: '图片上传类型错误',
  },
  imageUploadWithSizeFail: {
    errno: 103004,
    message: '图片上传超出大小限制',
  },
  h5WorkNotExistFail: {
    errno: 103005,
    message: '渲染作品不存在',
  },
};

export default class UtilsController extends Controller {

  splitIdAndUuid(str = '') {
    const result = { id: '', uuid: '' };
    if (!str) return result;
    const firstDashIndex = str.indexOf('-');
    if (firstDashIndex < 0) return result;
    result.id = str.slice(0, firstDashIndex);
    result.uuid = str.slice(firstDashIndex + 1);
    return result;
  }

  async renderH5Page() {
    const { ctx, service } = this;
    const { idAndUuid } = ctx.params;
    const query = this.splitIdAndUuid(idAndUuid);
    try {
      const pageData = await service.utils.renderToPageData(query);
      await ctx.render('page.tpl', pageData);
    } catch (error) {
      ctx.helper.fail({ ctx, errorType: 'h5WorkNotExistFail' });
    }
  }

  pathToURL(path: string) {
    const { app } = this;
    return path.replace(app.config.baseDir, app.config.baseUrl);
  }

  /** 上传图片 - oss*/
  async uploadToOSS() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const savedOSSPath = join('backend2', nanoid(6) + extname(stream.filename));
    try {
      const result = await ctx.oss.put(savedOSSPath, stream);
      const { url, name } = result;
      ctx.helper.success({ ctx, res: { name, url } });
    } catch (error) {
      await streamWormhole(stream);
      if ((error as any).code === 'MultipartFileTooLargeError') {
        ctx.helper.fail({ ctx, errorType: 'imageUploadWithSizeFail' });
      } else {
        ctx.helper.fail({ ctx, errorType: 'imageUploadFail' });
      }
    }
  }

  /** 上传图片 - oss*/
  async uploadToOSS2() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const savedOSSPath = join('backend2', nanoid(6) + extname(stream.filename));
    try {
      const result = await ctx.oss.put(savedOSSPath, stream);
      const { url } = result;
      ctx.helper.success({ ctx, res: { urls: [ url ] } });
    } catch (error) {
      await streamWormhole(stream);
      if ((error as any).code === 'MultipartFileTooLargeError') {
        ctx.helper.fail({ ctx, errorType: 'imageUploadWithSizeFail' });
      } else {
        ctx.helper.fail({ ctx, errorType: 'imageUploadFail' });
      }
    }
  }

  /** 上传图片 - oss 多文件上传*/
  async uploadMutipleFilesToOSS() {
    const { ctx, app } = this;
    const { fileSize } = app.config.multipart;
    const parts = ctx.multipart({
      limits: {
        fileSize: (fileSize as number),
      },
    });
    const urls: string[] = [];
    let part: FileStream | string[];
    while ((part = await parts())) {
      // console.log('_parts', part);
      if (Array.isArray(part)) {
        app.logger.info(part);
      } else {
        try {
          const savedOSSPath = join('backend2', nanoid(6) + extname(part.filename));
          const { url } = await ctx.oss.put(savedOSSPath, part);
          urls.push(url);
          // 判断上传文件是否超出限制: part.truncated = true
          if (part.truncated) {
            await ctx.oss.delete(savedOSSPath); //  删除 oss
            return ctx.helper.fail({ ctx, errorType: 'imageUploadWithSizeFail', error: `Reach fileSize limit ${((fileSize as number) / 1024)} kb` });
          }

        } catch (error) {
          await streamWormhole(part);
          ctx.helper.fail({ ctx, errorType: 'imageUploadFail' });
        }
      }
    }
    ctx.helper.success({ ctx, res: { urls } });
  }

  /** 上传图片 - stream mode pipeline*/
  // async uploadsByStreamPipeline() {
  //   const { ctx, app } = this;
  //   const stream = await ctx.getFileStream();
  //   const uid = nanoid(6);
  //   const saveFilePath = join(app.config.baseDir, 'uploads', uid + extname(stream.filename));
  //   const saveThumbnailFilePath = join(app.config.baseDir, 'uploads', uid + '_thumbnail' + extname(stream.filename));
  //   const target = createWriteStream(saveFilePath);
  //   const thumbTarget = createWriteStream(saveThumbnailFilePath);
  //   //  pipeline 进行流的操作
  //   const savePromise = pipeline(stream, target);
  //   const transformer = sharp().resize({ width: 300 });
  //   const saveThumbPromise = pipeline(stream, transformer, thumbTarget);
  //   try {
  //     await Promise.all([ savePromise, saveThumbPromise ]);
  //   } catch (error) {
  //     return ctx.helper.fail({ ctx, errorType: 'imageUploadFail' });
  //   }
  //   ctx.helper.success({ ctx, res: { url: this.pathToURL(saveFilePath), thumbnailUrl: this.pathToURL(saveThumbnailFilePath) } });
  // }

  /** 上传图片 - stream mode pipe*/
  // async uploadsByStream() {
  //   const { ctx, app } = this;
  //   const stream = await ctx.getFileStream();
  //   //  生成原始文件名和缩略图名 uploads/xxx/xxx.ext uploads/xxx/xxx_thumbnail.ext
  //   const uid = nanoid(6);
  //   const saveFilePath = join(app.config.baseDir, 'uploads', uid + extname(stream.filename));
  //   const saveThumbnailFilePath = join(app.config.baseDir, 'uploads', uid + '_thumbnail' + extname(stream.filename));
  //   //  创建可写流
  //   const target = createWriteStream(saveFilePath);
  //   const thumbTarget = createWriteStream(saveThumbnailFilePath);
  //   //  使用 promise 改写流转换过程
  //   const savePromise = new Promise((resolve, reject) => {
  //     stream.pipe(target)
  //       .on('finish', resolve)
  //       .on('error', reject);
  //   });
  //   const transformer = sharp().resize({ width: 300 }); //  转化流任务
  //   const saveThumbPromise = new Promise((resolve, reject) => {
  //     stream
  //       .on('error', reject) //  添加可写流错误监听
  //       .pipe(transformer)
  //       .on('error', reject) // 添加转化流错误监听
  //       .pipe(thumbTarget)
  //       .on('finish', resolve)
  //       .on('error', reject); //  可写流错误监听
  //   });
  //   //  使用 promise.all 执行流文件写入工作;
  //   try {
  //     await Promise.all([ savePromise, saveThumbPromise ]);
  //   } catch (error) {
  //     return ctx.helper.fail({ ctx, errorType: 'imageUploadFail' });
  //   }
  //   ctx.helper.success({ ctx, res: { url: this.pathToURL(saveFilePath), thumbnailUrl: this.pathToURL(saveThumbnailFilePath) } });
  // }

  /** 上传图片 - file mode & sharp 处理*/
  // async uploadsByFileAndSharp() {
  //   const { ctx, app } = this;
  //   if (ctx.request.files) {
  //     const file = ctx.request.files[0];
  //     const { filepath } = file;
  //     //  生成 sharp 实例, 用于图片处理等相关工作
  //     const imageSource = sharp(filepath);
  //     const metaData = await imageSource.metadata();
  //     let thumbnailUrl = '';
  //     //  检查图片宽度大于 300, 进行压缩生成缩略图, 存储格式 /uploads/**/abc-thumbnail.png */
  //     if (metaData.width && metaData.width > 300) {
  //       const { ext, name, dir } = parse(filepath);
  //       const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`);
  //       await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath);
  //       thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl);
  //     }
  //     const url = file.filepath.replace(app.config.baseDir, app.config.baseUrl);
  //     ctx.helper.success({ ctx, res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url } });
  //   } else {
  //     ctx.helper.fail({ ctx, errorType: 'uploadFail' });
  //   }
  // }
}
