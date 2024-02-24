/**
 * @name ServerMemberGraph
 * @author Salty
 * @description Adds an option to view a graph of the server member count over the past week when right-clicking on a server.
 * @version 1.0
 * @updateUrl https://github.com/UnrealSalty/BD_ServerMemberGraph/blob/main/ServerMemberGraph.js
 */

const { WebpackModules, Patcher, Modals, React } = BdApi;
const { MenuItem } = WebpackModules.getByProps('MenuItem');

class ServerMemberGraph {
    constructor() {
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    start() {
        // Patch the context menu for Guilds (servers)
        Patcher.after('ServerMemberGraph', WebpackModules.find(m => m.default && m.default.displayName === 'GuildContextMenu'), 'default', this.onContextMenu);
    }

    stop() {
        Patcher.unpatchAll('ServerMemberGraph');
    }

    async onContextMenu(_, [props], ret) {
        // Add "View Member Graph" option to the context menu
        const newMenuItem = React.createElement(MenuItem, {
            id: 'view-member-graph',
            label: 'View Member Graph',
            action: () => this.showMemberGraph(props.guild.id)
        });

        // Find the position to inject our new menu item (just as an example, you can adjust the position)
        const children = ret.props.children.props.children;
        const separatorIndex = children.findIndex(child => child && child.props && child.props.id === 'separator');
        children.splice(separatorIndex, 0, newMenuItem);
    }

    async showMemberGraph(guildId) {
        // Here, you should retrieve the member count data for the past week from your backend or storage
        // For demonstration, we'll use a static data structure
        const memberCounts = [
            { day: 'Day 1', count: 100 },
            { day: 'Day 2', count: 105 },
            { day: 'Day 3', count: 102 },
            // Add data for each day of the past week
        ];

        // Generate a simple graph using ASCII or integrate a chart library if you're able to inject custom HTML/CSS
        // For a complex implementation, you might need to create a custom modal or web frame within Discord
        // Here, we'll simply show the counts in a modal as a placeholder
        const graphText = memberCounts.map(entry => `${entry.day}: ${entry.count} members`).join('\n');
        Modals.showModal('Server Member Graph', graphText, {});
    }
}

module.exports = ServerMemberGraph;
