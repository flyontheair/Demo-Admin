import MenuOne from '../pages/MenuOne'
import One from '../pages/one/one'
import Two from '../pages/one/two'

export default{
    path: "/menuOne",
    component: MenuOne,
    redirect: '',
    children: [
        {
            path: "demoOne",
            component: One
        },{
            path: "demoTwo",
            component: Two
        }
    ]
}