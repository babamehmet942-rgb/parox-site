import discord
from discord.ext import commands
import os

# Bot için gerekli temel izinleri (intents) ayarlıyoruz
intents = discord.Intents.default()
intents.message_content = True

# Botumuzu '!' ön eki ile tanımlıyoruz
bot = commands.Bot(command_prefix='!', intents=intents)

# HTML dosyasının adı
HTML_DOSYASI = "index.html"

# Bot çalışmaya hazır olduğunda konsola mesaj yazdıracak
@bot.event
async def on_ready():
    print(f'Bot {bot.user} olarak giriş yaptı.')
    print(f'{HTML_DOSYASI} dosyasını düzenlemeye hazır.')
    print('-----------------------------------------')

@bot.command()
@commands.has_permissions(administrator=True) # Bu komutu sadece YÖNETİCİLER kullanabilir
async def key(ctx, *, yeni_key: str):
    """HTML dosyasına yeni bir giriş anahtarı ekler."""
    
    # Dosyanın var olup olmadığını kontrol et
    if not os.path.exists(HTML_DOSYASI):
        await ctx.send(f"Hata: `{HTML_DOSYASI}` dosyası sunucuda bulunamadı!")
        return

    try:
        # 1. Adım: Dosyayı oku
        with open(HTML_DOSYASI, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        yeni_satirlar = []
        found = False
        
        # 2. Adım: Doğru satırı bul ve düzenle
        for line in lines:
            # Satırın başında boşluklar olabileceği için .strip() kullanıyoruz
            if line.strip().startswith("const gecerliKodlar ="):
                found = True
                # Satırın sonundaki '];' kısmını bul ve yeni key'i ondan önce ekle
                # Örnek: "GIZLI-3G2H"];  ->  "GIZLI-3G2H", "YENI-KEY"];
                hedef_kisim = '];'
                if hedef_kisim in line:
                    # Yeni key'i formatlayıp ekliyoruz
                    guncel_line = line.replace(hedef_kisim, f', "{yeni_key}"{hedef_kisim}')
                    yeni_satirlar.append(guncel_line)
                    await ctx.send(f"✅ Başarılı! **{yeni_key}** anahtarı siteye eklendi.")
                else:
                    # Eğer satır formatı beklenmedikse hata ver
                    yeni_satirlar.append(line) # Satırı değiştirmeden ekle
                    await ctx.send(f"⚠️ Hata: Anahtar listesinin formatı bozuk olabilir. Dosyayı manuel kontrol et.")
            else:
                yeni_satirlar.append(line)

        if not found:
            await ctx.send(f"Hata: `{HTML_DOSYASI}` içinde `const gecerliKodlar =` satırı bulunamadı.")
            return

        # 3. Adım: Güncellenmiş içeriği dosyaya yaz
        with open(HTML_DOSYASI, 'w', encoding='utf-8') as f:
            f.writelines(yeni_satirlar)

    except Exception as e:
        await ctx.send(f"Beklenmedik bir hata oluştu: {e}")
        print(f"Hata: {e}")

# Yetki hatası yönetimi
@key.error
async def key_error(ctx, error):
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ Bu komutu kullanmak için **Yönetici** yetkisine sahip olmalısın.")
    elif isinstance(error, commands.MissingRequiredArgument):
        await ctx.send("❌ Lütfen bir anahtar belirt. Örnek: `!key YENI-ANAHTAR-123`")
    else:
        await ctx.send("Bir hata oluştu. Konsolu kontrol edin.")
        print(str(error))


# BURAYA KENDİ BOTUNUN TOKENINI YAPIŞTIR
TOKEN = "MTQzMjgxODU1Njg0Nzc4ODE0NA.G3SleG.14C3d5dldO8sdWof_Uba7ONV2Vc1k8GFG5emJo"
bot.run(TOKEN)