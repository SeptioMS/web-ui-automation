const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('SauceDemo automation test', function () {
    this.timeout(20000); // Tambahkan timeout agar cukup waktu untuk eksekusi

    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments('--incognito');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://www.saucedemo.com/');
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();
        await driver.wait(until.urlContains('inventory'), 5000);
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('should login success', async function () {
        let productTitle = await driver.findElement(By.className('title')).getText();
        assert.strictEqual(productTitle, 'Products');
    });

    it('should sort products from A to Z', async function () {
        // Pilih sorting "Name (A to Z)"
        let sortDropdown = await driver.findElement(By.className('product_sort_container'));
        await sortDropdown.click();
        await sortDropdown.findElement(By.css('option[value="az"]')).click();

        // Ambil semua nama produk setelah sorting
        await driver.sleep(1000); // Tunggu sebentar agar sorting selesai
        let productElements = await driver.findElements(By.className('inventory_item_name'));
        let productNames = [];
        for (let el of productElements) {
            productNames.push(await el.getText());
        }

        // Buat salinan dan sort ascending
        let sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));

        // Pastikan urutan produk sudah sesuai A-Z
        assert.deepStrictEqual(productNames, sortedNames);
    });
});