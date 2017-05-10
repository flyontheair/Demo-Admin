import MenuTwo from '../pages/MenuTwo'
import Three from '../pages/two/three'
import Four from '../pages/two/four'

export default{
    path: "/menuTwo",
    component: MenuTwo,
    redirect: '',
    children: [
        {
            path: "three",
            component: Three
        },{
            path: "four",
            component: Four
        }
    ]
}