import * as express from 'express';
export class SomeController {

	private socketUsers;
	constructor(socketUsers) {
		this.socketUsers = socketUsers 
	}

	private users = {
		users: {},
		results: {afavor: 0, encontra: 0}
	}

	a369b338cdb0

	async loginAdmin(req: express.Request): Promise<Object> {
		console.log("body recivido " + JSON.stringify(req.body));
		this.socketUsers[req.body.userId]['userName'] = req.body.name;

		this.sendAllUsers(req);

		return this.users;
	}

	async loginUser(req: express.Request): Promise<Object> {
		if (!this.users.users.hasOwnProperty(req.body.name)) {
			console.log("body recivido " + JSON.stringify(req.body));
			this.socketUsers[req.body.userId]['userName'] = req.body.name;
			this.users.users[req.body.name] = { userId: req.body.userId, votes: 0, maxVotes: 0, state: "", ami: 0, faction: req.body.faction };
		} else {
			if (req.body.faction !== undefined) {
				this.users.users[req.body.name].faction = req.body.faction;
			}
		}

		this.sendAllUsers(req);

		return this.users;
	}

	async userVote(req: express.Request): Promise<Object> {
		if (this.users.users.hasOwnProperty(req.body.name)) {

			var votes = Number.parseInt(req.body.votes);
			var afavor = req.body.afavor;

			this.users.users[req.body.name].maxVotes = this.users.users[req.body.name]['maxVotes'] - votes;
			this.users.users[req.body.name].votes = votes;
			this.users.users[req.body.name].state = "voted";

			var selectedBody = req.body.selectedUser;

			if (this.users.users.hasOwnProperty(selectedBody)) {
				this.users.users[selectedBody].ami = this.users.users[selectedBody].ami + votes;
			} else {
				if (afavor) {
					this.users.results.afavor += votes;
				} else {
					this.users.results.encontra += votes;
				}
			}

			this.sendAllUsers(req);
		}
		
		return this.users;
	}

	async setMaxVotes(req: express.Request): Promise<Object> {
		console.log("Llego max votes: " + req.body.name);
		if (this.users.users.hasOwnProperty(req.body.name)) {
			this.users.users[req.body.name]['maxVotes'] = req.body.maxVotes;
			this.sendAllUsers(req);
		}
		return this.users;
	}

	async skipVote(req: express.Request): Promise<Object> {
		console.log("Skip votes: " + req.body.name);
		if (this.users.users.hasOwnProperty(req.body.name)) {
			this.users.users[req.body.name].state = "skip";
			this.sendAllUsers(req);
		}
		return this.users;
	}

	async next(req: express.Request): Promise<Object> {
		Object.keys(this.users.users).forEach((userNAme) => {
			var user = this.users.users[userNAme];
			this.users.users[userNAme] = { userId: req.body.userId, votes: 0, maxVotes: this.users.users[userNAme].maxVotes, state: "", ami: 0 };
		})

		this.users.results = { afavor: 0, encontra: 0 }
		delete this.users['selectedCard'];

		this.sendAllUsers(req);

		return this.users;
	}

	async reset(req: express.Request): Promise<Object> {
		Object.keys(this.users.users).forEach((userNAme) => {
			var user = this.users.users[userNAme];
			this.users.users[userNAme] = { userId: req.body.userId, votes: 0, maxVotes: 0, state: "", ami: 0, faction: this.users.users[userNAme].faction };
		})

		this.users.results = { afavor: 0, encontra: 0 }
		delete this.users['selectedCard'];

		this.sendAllUsers(req);

		return this.users;
	}

	async remove(req: express.Request): Promise<Object> {
		delete this.users.users[req.body.toDelete];

		this.sendAllUsers(req);

		return this.users;
	}

	async politic(req: express.Request): Promise<Object> {

		this.users['selectedCard'] = req.body.name

		this.sendAllUsers(req);

		return this.users;
	}

	

	async sendUsers(req) {
		Object.keys(this.socketUsers).forEach(userId => {
			if (req.body.name !== this.socketUsers[userId].userName) {
				var request = JSON.stringify({ users: this.users })
				this.socketUsers[userId].client.send(request);
			} else {
				console.log("skiping user " + req.body.name);
			}
		})
	}

	async sendAllUsers(req) {
		Object.keys(this.socketUsers).forEach(userId => {
			var request = JSON.stringify({ users: this.users })
			this.socketUsers[userId].client.send(request);
		})
	}
	
}