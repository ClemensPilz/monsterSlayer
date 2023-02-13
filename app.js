function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            lastSpecialRound: 0,
            lastHealRound: 0,
            winner: null,
            logMessages: []
        };
    },
    methods: {
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        },
        surrender() {
            this.winner = 'monster';
        },
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.lastHealRound = 0;
            this.lastSpecialRound = 0;
            this.winner = null;
            this.logMessages = [];
        },
        healPlayer() {
            this.currentRound++;
            let healValue = getRand(8, 20);
            this.playerHealth += healValue;
            if (this.playerHealth > 100) {
                this.playerHealth = 100;
            };
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
            this.lastHealRound = this.currentRound;
        },
        attackMonster() {
            this.currentRound++;
            let attackValue = getRand(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            let attackValue = getRand(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            this.currentRound++;
            let attackValue = getRand(10, 25);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
            this.lastSpecialRound = this.currentRound;
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth <= 0) {
                return { width: '0%' };
            } else {
                return { width: this.monsterHealth + '%' };
            }
        },
        playerBarStyles() {
            if (this.playerHealth <= 0) {
                return { width: '0%' };
            } else {
                return { width: this.playerHealth + '%' };
            }
        },
        specialReady() {
            return (this.currentRound - this.lastSpecialRound >= 3 || this.lastSpecialRound === 0) ? true : false;
        },
        healReady() {
            return (this.currentRound - this.lastHealRound >= 3 || this.lastHealRound === 0) ? true : false;
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'player';
            }
        }

    }
});
app.mount('#game');