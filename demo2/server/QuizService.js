export class QuizService {
    constructor(room) {
        this.__sgId = "TableService";

        room.join(this, "quiz").then(talker => {
            console.log('>>>>>111222222');
            talker.on("loadQuiz").then(this._loadQuiz);
        });
    }

    _loadQuiz(message) {
        console.log('>>> _loadQuiz');
        message.reply("1+1=?")
    }
}
