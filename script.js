class KahootGame {
    constructor() {
        this.questions = [
            {
                question: "Какой бренд самый дорогой в мире?",
                answers: ["Apple", "Microsoft", "Amazon", "Google"],
                correct: 0
            },
            {
                question: "Какой логотип у Mercedes-Benz?",
                answers: ["Трезубец", "Звезда", "Кольца", "Лев"],
                correct: 1
            },
            {
                question: "Какой слоган у Nike?",
                answers: ["Impossible is Nothing", "Just Do It", "Think Different", "I'm Loving It"],
                correct: 1
            },
            {
                question: "Какого цвета логотип Coca-Cola?",
                answers: ["Красный", "Синий", "Зелёный", "Чёрный"],
                correct: 0
            },
            {
                question: "Какая компания создала iPhone?",
                answers: ["Samsung", "Apple", "Huawei", "Nokia"],
                correct: 1
            },
            {
                question: "Какой логотип у BMW?",
                answers: ["Щит", "Стрела", "Круг с секторами", "Звезда"],
                correct: 2
            },
            {
                question: "Какой бренд производит автомобиль Model S?",
                answers: ["BMW", "Audi", "Mercedes", "Tesla"],
                correct: 3
            },
            {
                question: "Какой цвет основной в логотипе Facebook?",
                answers: ["Красный", "Зелёный", "Синий", "Жёлтый"],
                correct: 2
            },
            {
                question: "Какая компания разработала Android?",
                answers: ["Apple", "Microsoft", "Google", "Samsung"],
                correct: 2
            },
            {
                question: "Какой логотип у Twitter/X?",
                answers: ["Птица", "Буква X", "Звезда", "Круг"],
                correct: 1
            },
            {
                question: "Кто основатель Tesla?",
                answers: ["Билл Гейтс", "Стив Джобс", "Илон Маск", "Марк Цукерберг"],
                correct: 2
            },
            {
                question: "Какая компания владеет Instagram?",
                answers: ["Google", "Meta", "Twitter", "Microsoft"],
                correct: 1
            },
            {
                question: "Какой цвет у логотипа WhatsApp?",
                answers: ["Синий", "Красный", "Зелёный", "Жёлтый"],
                correct: 2
            },
            {
                question: "Какая компания создала Windows?",
                answers: ["Apple", "Google", "Linux", "Microsoft"],
                correct: 3
            },
            {
                question: "Какой логотип у Apple?",
                answers: ["Надкусанное яблоко", "Целое яблоко", "Червивое яблоко", "Половина яблока"],
                correct: 0
            },
            {
                question: "Какая компания производит PlayStation?",
                answers: ["Microsoft", "Nintendo", "Sony", "Sega"],
                correct: 2
            },
            {
                question: "Какой цвет у логотипа YouTube?",
                answers: ["Синий", "Зелёный", "Красный", "Жёлтый"],
                correct: 2
            },
            {
                question: "Кто создал Facebook?",
                answers: ["Стив Джобс", "Марк Цукерберг", "Билл Гейтс", "Ларри Пейдж"],
                correct: 1
            },
            {
                question: "Какая компания разработала Chrome?",
                answers: ["Microsoft", "Mozilla", "Apple", "Google"],
                correct: 3
            },
            {
                question: "Какой логотип у Amazon?",
                answers: ["Стрелка вверх", "Улыбка", "Корзина", "Коробка"],
                correct: 1
            }
        ];

        this.currentQuestion = 0;
        this.players = [];
        this.minPlayers = 10;
        this.maxPlayers = 10;
        this.timeLeft = 20;
        this.timer = null;
        this.maxTime = 20;
        this.gameStarted = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Обработчик кнопки начала игры
        document.getElementById('start-game-btn').addEventListener('click', () => {
            const nameInput = document.getElementById('player-name');
            if (nameInput.value.trim()) {
                this.addPlayer(nameInput.value.trim());
                nameInput.value = '';
                
                if (this.players.length >= this.minPlayers) {
                    document.getElementById('start-game-btn').textContent = 'Начать игру!';
                }
                
                if (!this.gameStarted && this.players.length >= this.minPlayers) {
                    this.startGame();
                }
            } else {
                nameInput.classList.add('error');
                setTimeout(() => nameInput.classList.remove('error'), 500);
            }
        });

        // Обработчик Enter в поле имени
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('start-game-btn').click();
            }
        });

        // Обработчики кнопок ответов
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => this.checkAnswer(index));
        });

        // Обработчик кнопки рестарта
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }

    addPlayer(name) {
        if (this.players.length < this.maxPlayers && !this.gameStarted) {
            this.players.push({
                name: name,
                score: 0,
                currentAnswer: null
            });
            this.updatePlayersDisplay();
        }
    }

    updatePlayersDisplay() {
        const playersNeeded = this.minPlayers - this.players.length;
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        
        this.players.forEach(player => {
            const playerElement = document.createElement('div');
            playerElement.className = 'player-item';
            playerElement.innerHTML = `
                <span class="player-name">${player.name}</span>
                <span class="player-score">${player.score}</span>
            `;
            playersList.appendChild(playerElement);
        });

        const statusMessage = document.getElementById('players-status');
        if (playersNeeded > 0) {
            statusMessage.textContent = `Нужно ещё ${playersNeeded} игроков`;
        } else {
            statusMessage.textContent = 'Можно начинать игру!';
        }
    }

    startGame() {
        if (this.players.length >= this.minPlayers) {
            this.gameStarted = true;
            document.getElementById('name-screen').style.display = 'none';
            document.getElementById('game-screen').style.display = 'block';
            this.showQuestion();
        }
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion];
        document.getElementById('question').textContent = question.question;
        
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((button, index) => {
            button.querySelector('.answer-text').textContent = question.answers[index];
            button.disabled = false;
        });

        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = this.questions.length;

        // Сброс ответов игроков
        this.players.forEach(player => {
            player.currentAnswer = null;
        });

        this.startTimer();
    }

    startTimer() {
        this.timeLeft = this.maxTime;
        this.updateTimer();

        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.processAnswers();
            }
        }, 1000);
    }

    updateTimer() {
        document.getElementById('timer').textContent = this.timeLeft;
    }

    checkAnswer(answerIndex) {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer && currentPlayer.currentAnswer === null) {
            currentPlayer.currentAnswer = answerIndex;
            
            // Проверяем, все ли игроки ответили
            const allAnswered = this.players.every(player => player.currentAnswer !== null);
            if (allAnswered) {
                clearInterval(this.timer);
                this.processAnswers();
            }
        }
    }

    getCurrentPlayer() {
        // В реальной многопользовательской игре здесь была бы логика определения текущего игрока
        return this.players[0];
    }

    processAnswers() {
        const question = this.questions[this.currentQuestion];
        
        this.players.forEach(player => {
            if (player.currentAnswer === question.correct) {
                const timeBonus = Math.round((this.timeLeft / this.maxTime) * 1000);
                player.score += timeBonus;
            }
        });

        this.updatePlayersDisplay();
        this.showFeedback();
    }

    showFeedback() {
        const feedback = document.getElementById('feedback');
        const correctPlayers = this.players.filter(player => 
            player.currentAnswer === this.questions[this.currentQuestion].correct
        );

        const feedbackText = feedback.querySelector('.feedback-text');
        const feedbackScore = feedback.querySelector('.feedback-score');

        feedbackText.textContent = `Правильно ответили: ${correctPlayers.length} игроков`;
        feedbackScore.textContent = correctPlayers.map(p => p.name).join(', ');

        feedback.classList.add('active');
        feedback.style.backgroundColor = 'rgba(38, 137, 12, 0.9)';

        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(button => button.disabled = true);

        setTimeout(() => {
            feedback.classList.remove('active');
            this.currentQuestion++;
            this.showQuestion();
        }, 3000);
    }

    resetGame() {
        this.currentQuestion = 0;
        this.players = [];
        this.gameStarted = false;
        document.getElementById('result-screen').classList.remove('active');
        document.getElementById('name-screen').style.display = 'block';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('start-game-btn').textContent = 'Присоединиться';
        document.getElementById('player-name').value = '';
        this.updatePlayersDisplay();
    }

    endGame() {
        document.getElementById('result-screen').classList.add('active');
        
        // Сортируем игроков по очкам
        const sortedPlayers = [...this.players].sort((a, b) => b.score - a.score);
        
        // Показываем топ-3 игроков
        const finalResults = document.getElementById('final-results');
        finalResults.innerHTML = `
            <h3>Топ игроков:</h3>
            ${sortedPlayers.map((player, index) => `
                <div class="player-result ${index < 3 ? 'top-' + (index + 1) : ''}">
                    <span class="place">${index + 1}</span>
                    <span class="name">${player.name}</span>
                    <span class="score">${player.score}</span>
                </div>
            `).join('')}
        `;
        
        this.createConfetti();
    }

    createConfetti() {
        const confetti = document.getElementById('confetti');
        confetti.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.backgroundColor = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)];
            piece.style.left = Math.random() * 100 + '%';
            piece.style.animationDelay = Math.random() * 3 + 's';
            piece.style.animationDuration = Math.random() * 2 + 3 + 's';
            confetti.appendChild(piece);
        }
    }
}

// Создаём экземпляр игры при загрузке страницы
window.addEventListener('load', () => {
    new KahootGame();
});
