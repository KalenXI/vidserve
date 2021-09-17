<template>
    <v-app dark>
        <v-navigation-drawer
            v-model="drawer"
            :mini-variant="miniVariant"
            :clipped="clipped"
            fixed
            app>
            <v-list>
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :to="item.to"
                    router
                    exact>
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title" />
                    </v-list-item-content>
                </v-list-item>
                <v-list-group prepend-icon="mdi-bookshelf">
                    <template #activator>
                        <v-list-item-title>Libraries</v-list-item-title>
                    </template>
                    <v-list-item
                        v-for="library in libraries"
                        :key="library._id"
                        :to="'/library/' + library._id"
                        class="pr-6"
                        router
                        exact>
                        <v-list-item-action>
                            <v-icon>mdi-filmstrip-box-multiple</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title v-text="library.name" />
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group prepend-icon="mdi-book">
                    <template #activator>
                        <v-list-item-title>Categories</v-list-item-title>
                    </template>
                    <v-list-item
                        v-for="category in categories"
                        :key="category"
                        :to="'/category/' + category"
                        router
                        exact>
                        <v-list-item-action>
                            <v-icon>mdi-bookmark-outline</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title
                                v-text="
                                    category.charAt(0).toUpperCase() +
                                    category.slice(1)
                                " />
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="clipped" fixed app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <img
                style="width: 180px"
                class="mr-4"
                alt="Last Edit Logo"
                src="/last-edit-logo-white.svg" />
            <v-toolbar-title class="text-xl-h4 font-weight-bold">
                Videos
            </v-toolbar-title>
            <v-spacer />
            <v-btn color="primary"> Login</v-btn>
        </v-app-bar>
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer :absolute="!fixed" app>
            <span>&copy; {{ new Date().getFullYear() }} Kevin Vinck</span>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            categories: [],
            libraries: [],
            clipped: true,
            drawer: true,
            fixed: true,
            items: [
                {
                    icon: 'mdi-home',
                    title: 'Home Page',
                    to: '/',
                },
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: 'Last Edit Media',
        }
    },
    async fetch() {
        this.categories = await fetch('http://localhost:8000/category/').then(
            (res) => res.json()
        )
        this.libraries = await fetch('http://localhost:8000/library/').then(
            (res) => res.json()
        )
    },
}
</script>
