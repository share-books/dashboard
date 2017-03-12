
import test from 'ava'


const mock_api = (ok) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!ok)
                reject("ERROR")
            else
                resolve("OK")
        }, 1000)
    })
}
test.todo('will think about writing this later')
test.before('start-1', t => {
    // 这个会在所有测试前运行
    console.log("start-1")
})

test.before('start-2', t => {
    // 这个会在上面的方法后面运行，但在测试之前运行
    console.log("start-2")
})

test.after('cleanup', t => {
    // 这个会在所有测试之后运行
})
//上下文共享在 before 和 after 钩子中不可用。

//================================
test.beforeEach(t => {
    // 这个会在每个测试之前运行
    console.log("init...")
    t.context.data = 'demo'

})

test.afterEach(t => {
    // 这个会在每个测试之后运行
    console.log("finished",t.context.data)
})

test('api call OK', async t => {
    t.context.data = await mock_api(true)
    t.is(t.context.data, 'OK')
})
test('api call ERROR', async t => {
    try {
         await mock_api(false)
    }catch(err){
         t.is(err, 'ERROR')

    }
   
   
})
test('bool test', t => {
    let a = {}
    let b = a.b

    t.is(undefined, b)
    // t.is( true, b===b)
    t.is(true, b == null)
    t.is(false, !!b)
    a.b = true
    t.is(b != a.b, true)
})

test('obj test', t => {
    let a = { b: 1 }
    let b = a
    b.b = 2

    t.is(2, a.b)
    a.b = 3
    t.is(3, b.b)

    a = { b: 4 }
    t.is(b.b != a.b, true)
})

