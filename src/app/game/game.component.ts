import { Component, OnInit, Injectable, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, updateDoc, collectionData, getDocs, addDoc, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game!: Game;
  firestore: Firestore = inject(Firestore);
  gameDb = collection(this.firestore, 'games');
  gameId!: string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
        this.gameId = params['id'];
        onSnapshot(doc(this.gameDb, this.gameId), (game: any) => {
        const gameData = game.data();
        this.game.currentPlayer = gameData.currentPlayer;
        this.game.playedCards = gameData.playedCards;
        this.game.players = gameData.players;
        this.game.stack = gameData.stack;
        this.game.pickCardAnimation = gameData.pickCardAnimation;
        this.game.currentCard = gameData.currentCard;
      });
    });
  }

  async newGame() {
    this.game = new Game();
  }

  takeCard() {
    if(!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop()!; // Gibt den letzten Wert aus dem Array zurück und entfernt diesen
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.saveGame();
      }, 1000);
    };
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        if(this.game.players.length < 10) {
          this.game.players.push(name);
          this.saveGame();
        }
      }
    });
  }

  saveGame() {
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      console.log(params);
      updateDoc(doc(this.gameDb, params['id']), this.game.toJson());
    });
  }
}
