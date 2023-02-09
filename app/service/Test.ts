import { Service } from 'egg';
import { Schema } from 'mongoose';

/**
 * Test Service
 */
export default class Test extends Service {

  /**
   * sayHi to you
   * @param content - your content
   */
  public async sayHi(content: string) {
    return `hi, ${content}`;
  }

  private getPersonModel() {
    const app = this.app;
    const UserSchema = new Schema({
      name: { type: String },
      age: { type: Number },
      team: { type: Schema.Types.ObjectId },
    }, { collection: 'users' });
    return app.mongoose.model('User', UserSchema);
  }

  async showPlayers() {
    const PersonModel = this.getPersonModel();
    const result = await PersonModel.find({ age: { $gt: 20 } }).exec();
    return result;
  }
}
