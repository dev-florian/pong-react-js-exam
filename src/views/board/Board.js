import React, {Component} from 'react';
import './_index.scss';

class Board extends Component {

    constructor() {
        super();

        //Positionnement de la barre
        this.paddle1Y = 300;
        this.speed = 0;

        //Position de la ball
        this.ballX = 400;
        this.ballY = 300;

        this.state = {
            //Taille de la barre
            paddleHeight: 150,
            paddleWidth: 15,

            //Refresh par seconde
            framesPerSecond: 50,

            //Score du joueur
            score: 0,

            //clicked boutton central
            clicked: false,
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
    }


    launchPong() {
        this.setState({clicked: true});

        //Ajout d'un canvas
        const canvas = this.refs.canvas;
        const canvasContext = this.refs.canvas.getContext('2d');

        //Vitesse de la ball
        let ballSpeedX = 15;
        let ballSpeedY = 15;


        //On dessine un paddle
        const makeRectangleShape = (cX, cY, width, height, color) => {
            canvasContext.fillStyle = color;
            canvasContext.fillRect(cX, cY, width, height);
        };

        //On dessine un cercle
        const makeCircleShape = (cX, cY, radious, angle, color) => {
            canvasContext.fillStyle = color;
            canvasContext.beginPath();
            canvasContext.arc(cX, cY, radious, angle, Math.PI * 2, true);
            canvasContext.fill();
        };


        //Dessiner
        const draw = () => {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            //Construction du paddle
            makeRectangleShape(10, this.paddle1Y, this.state.paddleWidth, this.state.paddleHeight);

            //Construction de la ball
            makeCircleShape(this.ballX, this.ballY, 50, 0, "black");
        };

        //On fait bouger les elements du canvas
        const move = () => {

            this.paddle1Y = this.paddle1Y + this.speed;

            //On fait bouger la balle ( tout les framespersecond)
            this.ballX += ballSpeedX;
            this.ballY += ballSpeedY;

            //Estimons que nous somme du coté gauche
            //Si la balle est vers notre côté
            if (this.ballX < 75) {
                //Si la paddle touche la ball
                if ((this.ballY > this.paddle1Y) && (this.ballY < this.paddle1Y + this.state.paddleHeight)) {
                    //On tape un rebond
                    ballSpeedX = -ballSpeedX;

                    //Modification de la vitesse de renvoit
                    let deltaY = this.ballY - (this.paddle1Y + this.state.paddleHeight / 2);
                    ballSpeedY = deltaY * 0.60;
                } else {

                    //On ajoute au milieu et on reset
                    this.setState({score: this.state.score + 1});
                    ballReset();
                }
            }

            //Faire rebondir la balle
            //Rebond en haut
            if (this.ballY > 550) {
                ballSpeedY = -ballSpeedY
            }

            //Rebond en bas
            if (this.ballY < 50) {
                ballSpeedY = -ballSpeedY
            }

            //Rebond à droite
            if (this.ballX > 750) {
                ballSpeedX = -ballSpeedX
            }

        };

        //On replace la ball au milieu
        const ballReset = () => {
            this.ballX = canvas.width / 2;
            this.ballY = canvas.height / 2;

            //On fait repartir la balle dans le bon sens ( gauche à droite )
            ballSpeedX = -ballSpeedX;
        };


        setInterval(() => {
            draw();
            move();
        }, 1000 / this.state.framesPerSecond);
    }

    //ELEMENT PADDLE
    onKeyDown(e) {
        //Si touche du bas
        if (e.keyCode === 40) {
            if (this.paddle1Y < 550) {
                this.speed = 20;
            }
        }

        //Si touche du haut
        if (e.keyCode === 38) {
            if (this.paddle1Y > 50) {
                this.speed = -20;
            }
        }
    }

    onKeyUp(e) {
        this.speed = 0;
    }

    render() {
        return (
            <div className="Board">
                <button style={{x: this.ballX, y: this.ballY}} className={this.state.clicked ? "clicked" : ""}
                        onClick={() => this.launchPong()}><span>Let's go</span>
                </button>
                <canvas className={this.state.clicked ? "clicked" : ""} ref="canvas" width={800} height={600}/>
                <div className={this.state.clicked ? "clicked data" : "data"}>
                    <p className="score">Total defaite : {this.state.score}</p>
                </div>


            </div>
        );
    }
}

export default Board;
