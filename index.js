import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const validFields = ["acx","age","aheight","awidth","alpha","animations","apiercing","armor","attack","blast","cc","code","courage","crit","cskin","dex","dreturn","emblems",
  "emx","esize","evasion","explosion","fear","fireresistance","for","fx","fzresistance","gold","goldm","i","in","int","isize","items","j","last_fear","last_ms","lifesteal","luckm","m",
  "manasteal","map","max_xp","mcourage","miss","mp_cost","mp_reduction","name","pcourage","ping","pnresistance","pzazz","real_x","real_y","reflection","rpiercing","stand","str","stun","stype",
  "targets","tax","vit","xcx","xpm","xrange","afk","angle","c","cid","controller","ctype","cx","focus","frequency","hp","id","level","max_hp",
  "max_mp","mp","owner","party","pdps","q","range","resistance","rip","s","skin","slots","speed","target","x","y","xp","cash","critdamage","going_x","going_y","move_num","moving","type",
  "serverData"]

export default class Companion {
  #config
  constructor (username, password) {
    if (!username || !password) throw Error("Invalid Username or Password")
    this.username = username
    this.password = password
    this.isLoggedIn = false
    // Safe Firebase public config
    this.#config = {
      apiKey: "AIzaSyDqrZZU2MFW3KGLYtrdWsTvwftA7jT0jY0",
      authDomain: "al-debug-c39cc.firebaseapp.com",
      databaseURL: "https://al-debug-c39cc-default-rtdb.firebaseio.com",
      projectId: "al-debug-c39cc",
      storageBucket: "al-debug-c39cc.appspot.com",
      messagingSenderId: "328729378802",
      appId: "1:328729378802:web:f8af9ded0dfa91ef5cf56b",
      measurementId: "G-Y2NWCL9KCN"
    };
    this.user = null
    this.app = initializeApp(this.#config);
    this.auth = getAuth();
    this.db = getDatabase(this.app)
  }

  async login () {
    if (this.user) return Promise.resolve('Already authenticated')
    const { user } = await signInWithEmailAndPassword(this.auth, this.username, this.password).catch((error) => {
      this.user = null
      throw Error(error)
    })
    if (user?.uid) this.user = user
  }

  async updateCharacter (data) {
    if (!this.user) return Promise.reject('Not authenticated')
    const characterRef = ref(this.db, `characters/${data.name}`)
    return update(characterRef, {
      updatedAt: new Date().toString(),
      uid: this.user.uid,
      data
    }).catch((error) => {console.log(error)})
  }

  formatCharacterPayload (data) {
    return Object.entries(data).reduce((obj, [key, value]) => {
      if (validFields.includes(key)) obj[key] = value === undefined ? null : value
      return obj
    }, {})
  }
}