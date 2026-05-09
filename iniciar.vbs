var shell = WScript.CreateObject("WScript.Shell");
var exec = shell.Exec("cmd /c cd /d \"C:\\Users\\55499\\Downloads\\openclode teste\\saas de reviu\" && npm run start");

WScript.Echo("ReviewFlow iniciado!");
WScript.Echo("Acesse: http://localhost:3000");
WScript.Echo("Pressione Ctrl+C para encerrar");

while (exec.Status == 1) {
  WScript.Sleep(1000);
}