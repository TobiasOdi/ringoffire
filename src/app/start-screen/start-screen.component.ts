import { Component, OnInit, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, getDocs, addDoc, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  firestore: Firestore = inject(Firestore);
  gameDb = collection(this.firestore, 'games');

  constructor(private router: Router) {}

  newGame() {
    let game = new Game();
    addDoc(this.gameDb, game.toJson()).then((gameInfo) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  };
}
