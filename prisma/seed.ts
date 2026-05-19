import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 区域
  const districts = [
    '浦东新区', '徐汇区', '长宁区', '静安区', '普陀区',
    '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区',
    '金山区', '松江区', '青浦区', '奉贤区', '崇明区', '黄浦区',
  ]
  for (const name of districts) {
    await prisma.district.upsert({ where: { name }, update: {}, create: { name } })
  }

  // 产地
  const origins = [
    { name: '本地', province: '上海' },
    { name: '云南', province: '云南' },
    { name: '山东', province: '山东' },
    { name: '广东', province: '广东' },
    { name: '浙江', province: '浙江' },
    { name: '海南', province: '海南' },
    { name: '四川', province: '四川' },
    { name: '河南', province: '河南' },
    { name: '湖南', province: '湖南' },
    { name: '福建', province: '福建' },
  ]
  for (const o of origins) {
    await prisma.origin.upsert({ where: { name: o.name }, update: {}, create: o })
  }

  // 品质等级
  const grades = [
    { name: '精品', description: '外观优、无瑕疵、口感佳' },
    { name: '一级', description: '品质良好、规格整齐' },
    { name: '二级', description: '普通品质、轻微瑕疵' },
    { name: '统货', description: '不分等级混装' },
  ]
  for (const g of grades) {
    await prisma.qualityGrade.upsert({ where: { name: g.name }, update: {}, create: g })
  }

  // 品种（按品类）
  const products = [
    // 蔬菜
    { name: '西红柿', category: '蔬菜', unit: '斤' },
    { name: '黄瓜', category: '蔬菜', unit: '斤' },
    { name: '茄子', category: '蔬菜', unit: '斤' },
    { name: '土豆', category: '蔬菜', unit: '斤' },
    { name: '白菜', category: '蔬菜', unit: '斤' },
    { name: '菠菜', category: '蔬菜', unit: '斤' },
    { name: '青椒', category: '蔬菜', unit: '斤' },
    { name: '大葱', category: '蔬菜', unit: '斤' },
    // 水果
    { name: '苹果', category: '水果', unit: '斤' },
    { name: '香蕉', category: '水果', unit: '斤' },
    { name: '橙子', category: '水果', unit: '斤' },
    { name: '葡萄', category: '水果', unit: '斤' },
    { name: '西瓜', category: '水果', unit: '斤' },
    // 猪肉
    { name: '猪里脊', category: '猪肉', unit: '斤' },
    { name: '猪五花', category: '猪肉', unit: '斤' },
    { name: '猪排骨', category: '猪肉', unit: '斤' },
    // 牛羊肉
    { name: '牛腩', category: '牛羊肉', unit: '斤' },
    { name: '羊腿', category: '牛羊肉', unit: '斤' },
    // 禽类
    { name: '整鸡', category: '禽类', unit: '斤' },
    { name: '鸭腿', category: '禽类', unit: '斤' },
    // 水产
    { name: '草鱼', category: '水产', unit: '斤' },
    { name: '带鱼', category: '水产', unit: '斤' },
    { name: '虾', category: '水产', unit: '斤' },
    // 蛋类
    { name: '鸡蛋', category: '蛋类', unit: '个' },
    { name: '鸭蛋', category: '蛋类', unit: '个' },
    // 其他生鲜
    { name: '豆腐', category: '其他生鲜', unit: '斤' },
    { name: '年糕', category: '其他生鲜', unit: '斤' },
  ]
  for (const p of products) {
    await prisma.product.create({ data: p }).catch(() => {})
  }

  console.log('Seed data inserted successfully.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
