const db = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;
    if (id) {
      this._id = new ObjectId(id);
    }
  }

  static async fetchAll() {
    const posts = await db.getDb().collection('posts').find().toArray();
    return posts;
  }

  async fetch() {
    if (!this._id) {
      return;
    }
    const postDocument = await db
      .getDb()
      .collection('posts')
      .findOne({ _id: this._id });
    this.title = postDocument.title;
    this.content = postDocument.content;
  }

  async save() {
    try {
      let result;
      if (this._id) {
        result = await db
          .getDb()
          .collection('posts')
          .updateOne(
            { _id: this._id },
            { $set: { title: this.title, content: this.content } }
          );
        console.log('Post terupdate', result);
      } else {
        result = await db.getDb().collection('posts').insertOne({
          title: this.title,
          content: this.content,
        });
        console.log('Berhasil menambahkan artikel', result);
      }
      return result;
    } catch (error) {
      console.error('Gagal update atau post', error);
    }
  }

  async delete() {
    let result;
    if (!this._id) {
      console.log('POST TIDAK TERSEDIA', this._id);
      return;
    } else {
      result = await db.getDb().collection('posts').deleteOne({
        _id: this._id,
      });
      console.log('Post Berhasil Dihapus', result);
      return result;
    }
  }
}

module.exports = Post;
