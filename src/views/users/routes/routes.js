/* eslint-disable no-unused-vars */
import React from "react";
import { useTranslation } from "react-i18next";

// export const routesDash = [
//     {
//       name: 'General',
//       route: 'general',
//       text: 'General'
//     },
//     {
//       name: 'purchases',
//       route: 'my-purchases',
//       text: t("globals.reports")
//     },
//     {
//       name: 'pay',
//       route: 'payment-methods',
//       text: 'Métodos de pago'
//     },
//     {
//       name: 'refund',
//       route: 'refund-&-returns',
//       text: 'Devoluciones y reembolsos'
//     },
//     {
//       name: 'valorations',
//       route: 'valorations',
//       text: 'Valoraciones'
//     },
//     {
//       name: 'sender address',
//       route: 'my-address',
//       text: 'Dirección de envío'
//     },
//     {
//       name: 'messages',
//       route: 'my-messages',
//       text: 'Mensajes'
//     },
//     {
//       name: 'help center',
//       route: 'helpcenter',
//       text: 'Centro de ayuda'
//     },
//     {
//       name: 'reclamations center',
//       route: 'reclamations',
//       text: 'Centro de reclamos'
//     },
//     {
//       name: 'invite and earn',
//       route: 'referrals',
//       text: 'Invitar amigos'
//     },
//     {
//       name: 'sugestions',
//       route: 'suggestions',
//       text: 'Sugerencias'
//     },
//     {
//       name: 'Carrito',
//       route: 'my-cart',
//       text: 'Carrito'
//     },
//     {
//       name: 'settings',
//       route: 'settings',
//       text: 'Ajustes'
//     },

//   ];

export const useRoutesDash = () => {
  const { t, i18n } = useTranslation();

  return [
    {
      name: "General",
      route: "/dashboard/general",
      text: t("dashboard.general"),
    },
    {
      name: "purchases",
      route: "/dashboard/my-purchases",
      text: t("dashboard.orders"),
    },
    {
      name: "pay",
      route: "/dashboard/payment-methods",
      text: t("dashboard.paymentMethods"),
    },
    {
      name: "refund",
      route: "/dashboard/refund-&-returns",
      text: t("dashboard.refunds"),
    },
    {
      name: "valorations",
      route: "/dashboard/valorations",
      text: t("dashboard.ratings"),
    },
    {
      name: "sender address",
      route: "/dashboard/my-address",
      text: t("dashboard.shipping"),
    },
    {
      name: "messages",
      route: "/dashboard/my-messages",
      text: t("dashboard.messages"),
    },
    {
      name: "help center",
      route: "/dashboard/helpcenter",
      text: t("dashboard.helpcenter"),
    },
    {
      name: "reclamations center",
      route: "/dashboard/reclamations",
      text: t("dashboard.claimCenter"),
    },
    {
      name: "invite and earn",
      route: "/dashboard/referrals",
      text: t("dashboard.invite"),
    },
    {
      name: "sugestions",
      route: "/dashboard/suggestions",
      text: t("dashboard.suggestions"),
    },
    { name: "Carrito", route: "/dashboard/my-cart", text: t("dashboard.cart") },
    {
      name: "settings",
      route: "/dashboard/settings",
      text: t("dashboard.settings"),
    },
  ];
};
export const useRoutesDashAdmin = () => {
  const { t, i18n } = useTranslation();

  return [
    {
      name: "General",
      route: "/admin/dashboard",
      text: "General",
    },
    {
      name: "reports",
      route: "reports",
      text: "Reportes",
    },
    {
      name: "orders",
      route: "orders",
      text: "Pedidos",
    },
    {
      name: "memberships",
      route: "memberships",
      text: "Membresías",
    },

    {
      name: "users",
      route: "users",
      text: "Usuarios",
    },
    {
      name: "validations",
      route: "validations",
      text: "Validaciones",
    },
    {
      name: "finances",
      route: "finances",
      text: "Finanzas",
    },
    {
      name: "user verify",
      route: "verify-profile",
      text: "Verificación de usuarios",
    },
    {
      name: "warranty",
      route: "warranty",
      text: "Garantías",
    },

    {
      name: "sugestions",
      route: "discounts",
      text: "Descuentos",
    },
    {
      name: "products",
      route: "products",
      text: "Productos",
    },
    {
      name: "settings",
      route: "settings",
      text: "Ajustes",
    },
  ];
};
export const useRoutesFooter = () => {
  const { t, i18n } = useTranslation();

  return [
    { name: "tyc", route: "/tyc", text: t("footer.workUs") },
    { name: "about us", route: "/about-us", text: t("footer.about") },
    { name: "blog", route: "/blog", text: t("footer.blog") },
    {
      name: "buy and collect",
      route: "/buy-and-collect",
      text: t("footer.buyAndCollect"),
    },
    { name: "Franchises", route: "/franchises", text: t("footer.Franchises") },
    { name: "supplier", route: "/supplier", text: t("footer.supplier") },
    {
      name: "super Deliver",
      route: "/super-deliver",
      text: t("footer.superDeliver"),
    },
    { name: "afiliatte", route: "/afiliatte", text: t("footer.afiliatte") },
    { name: "sellApp", route: "/sell-apps", text: t("footer.sellApp") },
    {
      name: "advertise",
      route: "/advertise-with-us",
      text: t("footer.advertise"),
    },
    { name: "redem", route: "/redem-points", text: t("footer.redem") },
    {
      name: "recharge",
      route: "/recharge-balance",
      text: t("footer.recharge"),
    },
    {
      name: "currency",
      route: "/currency-converter",
      text: t("footer.currency"),
    },
    { name: "buy Ast", route: "/buy-ast", text: t("footer.buyAst") },
    {
      name: "buy With Ast",
      route: "/buy-with-ast",
      text: t("footer.buyWithAst"),
    },
    { name: "buy Nft", route: "/buy-nft", text: t("footer.buyNft") },
    {
      name: "buy With Nft",
      route: "/buy-with-nft",
      text: t("footer.buyWithNft"),
    },
    { name: "helpcenter", route: "/helpcenter", text: t("footer.helpcenter") },
    { name: "contact", route: "/contact", text: t("footer.contact") },
    { name: "pqrs", route: "/pqrs", text: t("footer.pqrs") },
    {
      name: "exchange Returns",
      route: "/exchange-and-returns",
      text: t("footer.exchangeReturns"),
    },
    {
      name: "exchanges Returns",
      route: "/exchanges-and-returns",
      text: t("footer.exchangesReturns"),
    },
    {
      name: "update Data",
      route: "/update-data",
      text: t("footer.updateData"),
    },
    { name: "tyc", route: "/tyc", text: t("footer.tyc") },
    {
      name: "market Terms",
      route: "/marketplace-terms",
      text: t("footer.marketTerms"),
    },
    {
      name: "privacy Policy",
      route: "/privacy-policy",
      text: t("footer.privacyPolicy"),
    },
    {
      name: "data treathment",
      route: "/data-treatment",
      text: t("footer.dataAuth"),
    },
    {
      name: "superintendency of industria and commerce",
      route: "/superintendency-of-industria-and-commerce",
      text: t("footer.sic"),
    },
    {
      name: "right to retract",
      route: "/right-to-retract",
      text: t("footer.rigthWith"),
    },
    {
      name: "request reverse",
      route: "/request-reverse",
      text: t("footer.requestReversal"),
    },
  ];
};
