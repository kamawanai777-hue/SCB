const mapCanvases = {};
const resistancesKeys = ["magic", "poison", "disease", "fireTotal", "frostTotal", "shockTotal"];
const resistancesParams = {
	magic: 85,
	poison: 85,
	disease: 100,
	fireTotal: 97.75,
	frostTotal: 97.75,
	shockTotal: 97.75
};
for (const canvas of document.querySelectorAll("canvas")) {
	canvas.height = 22;
	canvas.width = 202;
	const ctx = canvas.getContext("2d");
	drawRect(ctx);
	mapCanvases[canvas.dataset.canvas] = ctx;
}
function drawRect(ctx) {
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.roundRect(1, 1, 200, 20, [4]);
	ctx.stroke();
}
function fillArmor(ctx, value) {
	ctx.clearRect(0, 0, 202, 22);
	const res = Math.min(Math.floor((198 / 80) * value), 198);
	ctx.fillStyle = "green";
	ctx.fillRect(2, 2, res, 18);
	drawRect(ctx);
}
function fillResistances(ctx, value, param) {
	ctx.clearRect(0, 0, 202, 22);
	const res = Math.min(Math.floor((198 / param) * value), 198);
	ctx.fillStyle = "green";
	ctx.fillRect(2, 2, res, 18);
	drawRect(ctx);
}
export {resistancesKeys, fillArmor, fillResistances, mapCanvases, resistancesParams};