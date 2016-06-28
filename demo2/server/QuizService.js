export class QuizService {
    constructor(room) {
        this.__sgId = "TableService";

        room.join(this, "quiz").then(talker => {
            talker.on("loadQuiz").then(this._loadQuiz);
        });
    }

    _loadQuiz(message) {
        message.reply("1+1=?")
    }
}
