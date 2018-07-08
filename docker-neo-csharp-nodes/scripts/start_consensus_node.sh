#!/usr/bin/expect -f
set dnpath [lindex $argv 0]
set wallet [lindex $argv 1]
set password [lindex $argv 2]
set rpcFlag [lindex $argv 3]
set timeout -1
cd $dnpath

if { $rpcFlag == "callRPC" } {
	spawn dotnet neo-cli.dll --rpc
} else {
	spawn dotnet neo-cli.dll
}

expect "neo>"
send "open wallet $wallet\n"
expect "password:"
send "$password\n"
expect "neo>"
send "start consensus\n"
#expect "OnStart"
#expect "LIVEFOREVER"
interact
