/*
 * Copyright (C) 2016 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
    
/*
 *
 * @title SQL Database Commands - A quick debugging plugin for phantombot
 * @author Nekres
 * @contact https://phantombot.net/
 *
 */
(function() {
    var databaseCmd_status = new Array();

    /**
     * @event command
     */
    $.bind('command', function (event) {
        var sender = event.getSender();

        if (!$.isMod(sender)) { return; }
        
        //var username = $.username.resolve(sender);
        var command = event.getCommand();
        var args = event.getArgs();
        var action = args[0];
        
        if (!command.equalsIgnoreCase('dbedit')) { return; }
        if (!action) { return; }

        if (databaseCmd_status[0]) {
            if (databaseCmd_status[0] == 'clearing') {
                if (action.equalsIgnoreCase('yes')) {
                    var _content = $.inidb.GetKeyList(databaseCmd_status[1], '');
                    for (var i = 0; i < _content.length; i++) {
                        $.inidb.del(databaseCmd_status[1], _content[i]);
                    }
                    $.say($.lang.get('[./phantombot.db]', + 'database.command.event.command.table', + '\'', + databaseCmd_status[1], + '\'', + 'database.command.event.command.table2'));
                    databaseCmd_status = [];
                }
                if (action.equalsIgnoreCase('no')) {
                    $.say($.lang.get('[./phantombot.db]', + 'database.command.event.command.table', + '\'', + databaseCmd_status[1], + '\'', + 'database.command.event.command.table3'));
                    databaseCmd_status = [];
                }
            }

            if (databaseCmd_status[0] == 'removing') {
                if (action.equalsIgnoreCase('yes')) {
                    $.inidb.del(databaseCmd_status[1], databaseCmd_status[2]);
                    $.say('[./phantombot.db]', + 'database.command.event.command.key', + '\'', + databaseCmd_status[2], + '\'', + 'database.command.event.command.table4', + '\'', + databaseCmd_status[1], + '\'', + 'database.command.event.command.table5');
                    databaseCmd_status = [];
                }
                if (action.equalsIgnoreCase('no')) {
                    $.say('[./phantombot.db]', + 'database.command.event.command.key', + '\'', + databaseCmd_status[2], + '\'', + 'database.command.event.command.table4', + '\'', + databaseCmd_status[1], + '\'', + 'database.command.event.command.table6');
                    databaseCmd_status = [];
                }
            }
            return;
        }

        /**
         * @commandpath dbedit clear [table] - Clears a table.
         */
        if (action.equalsIgnoreCase('clear')) {
            
            if (!args[1]) { $.say($.lang.get('[./phantombot.db]', + 'database.command.commandpath.clear.usage')); return; }
            
            if ($.inidb.FileExists(args[1])) {
                databaseCmd_status = [ 'clearing', String(args[1]) ];
                $.say($.lang.get('[./phantombot.db]', + 'database.command.commandpath.clear1', + '\'', + args[1], + '\'?', + 'database.command.commandpath.clear2')); 
                setTimeout(function() { databaseCmd_status = []; }, 20000);
            } else {
                $.say($.lang.get('[./phantombot.db]', + 'database.command.commandpath.clear3'));
            }
        }

        /**
         * @commandpath dbedit remove [table] [key] - Removes a single key in a given table.
         */
        if (action.equalsIgnoreCase('remove')) {

            if (!args[2]) { $.say($.lang.get('[./phantombot.db]', + 'database.command.commandpath.remove.usage')); return; }

            if ($.inidb.exists(args[1], args[2])) {
                databaseCmd_status = [ 'removing', String(args[1]), String(args[2]) ];
                $.say($.lang.get('[./phantombot.db]', + 'database.command.commandpath.remove', + '\'', + args[2], + '\'', + 'database.command.commandpath.remove2', + '\'', + args[1], + '\'?', + 'database.command.commandpath.remove3')); 
                setTimeout(function() { databaseCmd_status = []; }, 20000);
            } else {
                $.say($.lang.get('[./phantombot.db]', + 'database.command.commandpath.remove4'));
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./commands/databaseCommand.js')) {
            $.registerChatCommand("./commands/databaseCommand.js", "dbedit", 2);
            $.registerChatSubcommand('dbedit', 'clear', 2);
            $.registerChatSubcommand('dbedit', 'remove', 2);
        }
    });
})();