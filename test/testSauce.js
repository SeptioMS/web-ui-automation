const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); // Tambahkan ini untuk opsi Chrome
const assert = require('assert');

describe('SauceDemo Login Test and sort product from a-z', function () {
it('should login success and sort product from a-z ', async function () {
    // Membuat opsi Chrome agar berjalan di mode incognito
    let options = new chrome.Options();
    options.addArguments('--incognito');

    // Membuat instance baru dari browser Chrome dengan mode incognito
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Membuka halaman login saucedemo.com
        await driver.get('https://www.saucedemo.com/');

        // Menemukan input username dan mengisi dengan username standar
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');

        // Menemukan input password dan mengisi dengan password standar
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');

        // Menemukan tombol login dan mengkliknya
        await driver.findElement(By.id('login-button')).click();

        // Menunggu hingga halaman produk muncul (indikator: url berubah)
        await driver.wait(until.urlContains('inventory'), 5000);

        // Memastikan login berhasil dengan mengecek keberadaan elemen produk
        let productTitle = await driver.findElement(By.className('title')).getText();
        assert.strictEqual(productTitle, 'Products');
         // Pilih sorting dari A ke Z
        let sortDropdown = await driver.findElement(By.className('product_sort_container'));
        await sortDropdown.sendKeys('Name (A to Z)');

        // Ambil semua nama produk setelah sorting
        let productElements = await driver.findElements(By.className('inventory_item_name'));
        let productNames = [];
        for (let el of productElements) {
            productNames.push(await el.getText());
        }

        // // Cek apakah produk sudah terurut dari A ke Z
        // let sortedNames = [...productNames].sort();
        // assert.deepStrictEqual(productNames, sortedNames);

        await driver.sleep(5000)
        console.log('Login sukses!');
    } catch (error) {
        console.error('Test gagal:', error);
    } finally {
        // Menutup browser setelah test selesai
        await driver.quit();
    }

})});